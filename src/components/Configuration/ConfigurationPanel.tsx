
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import CategoriesConfig from "@/components/Configuration/CategoriesConfig";
import SlaRulesConfig from "@/components/Configuration/SlaRulesConfig";
import EmailTemplatesConfig from "@/components/Configuration/EmailTemplatesConfig";
import GlobalParamsConfig from "@/components/Configuration/GlobalParamsConfig";

const ConfigurationPanel = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
        <p className="text-muted-foreground">
          Administre todas las configuraciones globales del sistema de soporte técnico
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="categories">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="categories">Categorías</TabsTrigger>
              <TabsTrigger value="sla">Reglas de SLA</TabsTrigger>
              <TabsTrigger value="templates">Plantillas de Correo</TabsTrigger>
              <TabsTrigger value="params">Parámetros Globales</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <CategoriesConfig />
            </TabsContent>
            <TabsContent value="sla">
              <SlaRulesConfig />
            </TabsContent>
            <TabsContent value="templates">
              <EmailTemplatesConfig />
            </TabsContent>
            <TabsContent value="params">
              <GlobalParamsConfig />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigurationPanel;
